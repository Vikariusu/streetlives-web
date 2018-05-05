import {
  GET_LOCATION_RESPONSE,
  GET_TAXONOMY_RESPONSE,
  SELECT_CATEGORIES_ACTION,
  OPTIMISTIC_UPDATE_LOCATION,
  ROLLBACK_UPDATE_LOCATION,
  OPTIMISTIC_UPDATE_PHONE,
  OPTIMISTIC_CREATE_PHONE,
  CREATE_PHONE_SUCCESS,
  OPTIMISTIC_UPDATE_ORGANIZATION,
} from '../actions';

export const locationsReducer = (state = {}, action) => {
  const dateString = (new Date()).toISOString();
  switch (action.type) {
    case GET_LOCATION_RESPONSE:
      if (action.payload) {
        return { ...state, [action.payload.id]: action.payload };
      }
      break;
    case GET_TAXONOMY_RESPONSE:
      return action.payload ? { ...state, taxonomy: [...action.payload] } : state;
    case SELECT_CATEGORIES_ACTION:
      return { ...state, locationServices: [...action.payload] };
    case OPTIMISTIC_UPDATE_ORGANIZATION:
      if (action.payload) {
        const { metaDataSection, fieldName, locationId, params } = action.payload;
        const location = state[locationId];
        const organization = location.Organization;
        return {
          ...state,
          [`last/${locationId}`]: state[locationId],
          [locationId]: {
            ...state[locationId],
            Organization : {
              ...organization,
              ...params
            },
            metadata : constructUpdatedMetadata(location, metaDataSection, fieldName, dateString)
          },
        };
      }
      break;
    case OPTIMISTIC_UPDATE_LOCATION:
      if (action.payload) {
        const { id, params, metaDataSection, fieldName } = action.payload;
        const location = state[id];
        return {
          ...state,
          [`last/${id}`]: location,
          [id]: {
            ...location,
            ...params,
            metadata : constructUpdatedMetadata(location, metaDataSection, fieldName, dateString)
          },
        };
      }
      break;
    case ROLLBACK_UPDATE_LOCATION:
      if (action.payload) {
        return {
          ...state,
          [`last/${action.payload.id}`]: null,
          [action.payload.id]: state[`last/${action.payload.id}`],
        };
      }
      break;
    case OPTIMISTIC_UPDATE_PHONE: {
      const location = state[action.payload.locationId];
      const idx = location.Phones.findIndex(phone => phone.id === action.payload.phoneId);
      const phone = location.Phones[idx];
      const newPhones = [
        ...location.Phones.slice(0, idx),
        { ...phone, ...action.payload.params },
        ...location.Phones.slice(idx + 1),
      ];
      return constructNewStateWithUpdatedPhones(state, action, newPhones, location, dateString);
    }
    case OPTIMISTIC_CREATE_PHONE: {
      const location = state[action.payload.locationId];
      let newPhones;
      if (!location.Phones) {
        newPhones = [action.payload.params];
      } else {
        newPhones = location.Phones.concat(action.payload.params);
      }
      return constructNewStateWithUpdatedPhones(state, action, newPhones, location, dateString);
    }
    case CREATE_PHONE_SUCCESS: {
      const location = state[action.payload.locationId];
      const idx = location.Phones.findIndex(phone =>
        !phone.id &&
          phone.number === action.payload.params.number &&
          phone.extension === action.payload.params.extension);
      const phone = location.Phones[idx];
      const newPhones = [
        ...location.Phones.slice(0, idx),
        { ...phone, ...action.payload.params },
        ...location.Phones.slice(idx + 1),
      ];
      return constructNewStateWithUpdatedPhones(state, action, newPhones, location, dateString);
    }
    default:
      return state;
  }

  return state;
};

function constructNewStateWithUpdatedPhones(state, action, newPhones, location, dateString) {
  const { metaDataSection, fieldName, locationId } = action.payload;
  return {
    ...state,
    [`last/${locationId}`]: state[locationId],
    [locationId]: {
      ...state[locationId],
      Phones: newPhones,
      metadata: constructUpdatedMetadata(location, metaDataSection, fieldName, dateString)
    },
  };
}

function constructUpdatedMetadata(location, metaDataSection, fieldName, dateString){
  const metadata = location.metadata;
  const subFields = metadata[metaDataSection];
  const newField = { field_name: fieldName, last_action_date: dateString };
  const newSubFields = subFields.map(field => field.field_name === fieldName ? newField : field );

  return {
    ...metadata,
    [metaDataSection] : newSubFields
  };
}

export const selectLocationData = (state, locationId) => state.locations[locationId];