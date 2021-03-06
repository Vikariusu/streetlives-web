import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { selectLocationData, selectLocationError } from '../../../../selectors/location';
import { updateOrganization, getLocation } from '../../../../actions';
import { Form, FormEdit, FormView } from '../../../../components/form';

const OrganizationNameEdit = compose(withProps({
  headerText: "What's this organization's name?",
  placeholderText: 'Enter the name of the organization',
}))(props => <FormEdit {...props} />);

const OrganizationNameView = compose(withProps({
  topText: 'ORGANIZATION NAME',
}))(props => <FormView {...props} />);

const OrganizationName = compose(withProps({
  ViewComponent: OrganizationNameView,
  EditComponent: OrganizationNameEdit,
}))(props => <Form {...props} />);

export const selectValue = locationData => (
  locationData && locationData.Organization && locationData.Organization.name
    ? locationData.Organization.name
    : null
);

const mapStateToProps = (state, ownProps) => {
  const locationData = selectLocationData(state, ownProps);
  const locationError = selectLocationError(state, ownProps);

  return {
    value: selectValue(locationData),
    resourceData: locationData,
    id: locationData && locationData.Organization && locationData.Organization.id,
    resourceLoadError: locationError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateValue: (newOrganizationName, organizationId, metaDataSection, fieldName) =>
    dispatch(updateOrganization(
      ownProps.match.params.locationId,
      organizationId,
      { name: newOrganizationName },
      metaDataSection,
      fieldName,
    )),
  fetchResourceData: (locationId) => {
    dispatch(getLocation(locationId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationName);
