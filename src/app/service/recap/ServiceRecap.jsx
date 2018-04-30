import React, { Component } from 'react';

import Button from '../../../components/button';
import Header from '../../../components/header';
import SectionHeader from '../../../components/sectionHeader';

import NavBar from '../../NavBar';
import ListItem from './ListItem';

const FAKE_DATA = {
  shelter: {
    1: { name: 'Community shelter', selected: true },
  },
  food: {
    1: { name: 'Soup Kitchen', selected: true },
    2: { name: 'Mobile Soup Kitchen', selected: true },
    3: { name: 'Food Panty', selected: true },
    4: { name: 'Brown Bag Lunch' },
  },
  other: {
    1: { name: 'Project ID', selected: true },
  },
};

class ServicesRecap extends Component {
  state = { services: FAKE_DATA };

  onNext = () => console.log('Clicked Next'); // eslint-disable-line no-console

  getServiceItems = (category) => {
    const { services } = this.state;

    return Object.keys(services[category]).map((id) => {
      const service = services[category][id];

      return service.selected ? (
        <ListItem key={id} title={service.name} progress={service.progress || 0} />
      ) : (
        undefined
      );
    });
  };

  render() {
    return (
      <div className="text-left">
        <NavBar title="Services recap" />
        <div className="mb-5">
          <div className="py-5 px-3 container">
            <Header>
              Please fill in all the information available for each of the services at this
              location:
            </Header>
          </div>

          <SectionHeader title="Shelter" icon="home" />
          {this.getServiceItems('shelter')}

          <SectionHeader title="Food" icon="cutlery" />
          {this.getServiceItems('food')}

          <SectionHeader title="Other Services" icon="ellipsis-h" />
          {this.getServiceItems('other')}
        </div>
        <div className="position-fixed" style={{ right: 0, bottom: 0, left: 0 }}>
          <Button fluid primary onClick={this.onNext}>
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export default ServicesRecap;