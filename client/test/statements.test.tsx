import * as React from "react";
import { shallow } from 'enzyme';
import {Reviews} from "../src/reviews"
import {Collection} from "../src/collection"
import {GameDetails} from "../src/games"
import {FormSelect, ReviewInput, ReviewInputArea, SignInInput, SignInButton } from "../src/widgets"
import {Login, Register} from "../src/login"

describe("Test on forms and inputs", () => {
  test('Login forms update values correctly.', (done) => {
    const wrapper = shallow (<Login />)
    wrapper.find(SignInInput).at(0).simulate('change', { currentTarget: { value: 'MyUsername' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<SignInInput value='MyUsername' />)).toEqual(true);

    wrapper.find(SignInInput).at(1).simulate('change', { currentTarget: { value: 'MyPassword' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<SignInInput value='MyPassword' />)).toEqual(true);

    wrapper.find(SignInButton).at(1).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/register');
      done();
    });
  });

  test('Register forms update values correctly.', (done) => {
    const wrapper = shallow (<Register />)
    wrapper.find(SignInInput).at(0).simulate('change', { currentTarget: { value: 'MyUsername' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<SignInInput value='MyUsername' />)).toEqual(true);

    wrapper.find(SignInInput).at(1).simulate('change', { currentTarget: { value: 'MyPassword' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<SignInInput value='MyPassword' />)).toEqual(true);

    wrapper.find(SignInInput).at(2).simulate('change', { currentTarget: { value: 'MyPasswordRepeated' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<SignInInput value='MyPasswordRepeated' />)).toEqual(true);

    wrapper.find(SignInButton).at(1).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/login');
      done();
    });
  });
  
  // Skipping testing select boxes in collection.tsx, because the select boxes are not initially loaded, making it hard to test.
  test.skip('Collection select-forms update values correctly.', (done) => {
    const wrapper = shallow (<Collection />)

    wrapper.find(FormSelect).at(0).simulate('change', { currentTarget: { value: 'Alphabetically (A-Z)' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<FormSelect value='Alphabetically (A-Z)' />)).toEqual(true);

    wrapper.find(FormSelect).at(1).simulate('change', { currentTarget: { value: 1 } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<FormSelect value="1" />)).toEqual(true);

    done();
  });

  // Skipping testing select boxes in collection.tsx, because the select boxes are not initially loaded, making it hard to test.
  test.skip('Reviews select-forms update values correctly.', (done) => {
    const wrapper = shallow (<Reviews />)

    wrapper.find(FormSelect).at(0).simulate('change', { currentTarget: { value: 'Top rated' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<FormSelect value='Top rated' />)).toEqual(true);

    wrapper.find(FormSelect).at(1).simulate('change', { currentTarget: { value: 1 } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<FormSelect value="1" />)).toEqual(true);

    done();
  });

  // Skipping testing forms in games.tsx, as they are hidden/disabled when users are not logged in, making it hard to test.
  test.skip('Form to create new reviews update values correctly', (done) => {
    const wrapper = shallow (<GameDetails match={{params: {id: 241} }}/>)
    wrapper.find(ReviewInput).at(0).simulate('change', { currentTarget: { value: 'New review' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<ReviewInput value='New review' />)).toEqual(true);

    wrapper.find(ReviewInputArea).at(0).simulate('change', { currentTarget: { value: 'Very good game.' } });
    // @ts-ignore (mangler alle properties, kun value nødvendig for test)
    expect(wrapper.containsMatchingElement(<ReviewInputArea value='Very good game.' />)).toEqual(true);

    done();
  });
})