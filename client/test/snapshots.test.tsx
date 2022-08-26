import * as React from "react";
import { shallow } from 'enzyme';
import {Reviews} from "../src/reviews"
import {Collection} from "../src/collection"
import {GameDetails} from "../src/games"
import {Menu, Home} from "../src/index"
import {Login, Register, LoggedOut} from "../src/login"
import {Search} from "../src/search"

describe("Test on client with snapshot", () => {
    test("reviews matches snapshot", () =>{
        jest.setTimeout(10000);
        const wrapper = shallow(<Reviews />)
             expect(wrapper).toMatchSnapshot();
    })
    test("collection matches snapshot", () =>{
        jest.setTimeout(10000);
        const wrapper = shallow (<Collection />)
            expect(wrapper).toMatchSnapshot();
    })
    test("games matches snapshot", () => {
        jest.setTimeout(10000);
        const wrapper = shallow (<GameDetails match={{params: {id: 1} }}/>)
        expect(wrapper).toMatchSnapshot();
    })
    test("Menu in index matches snapshot", () => {
        jest.setTimeout(10000);
        const wrapper = shallow (<Menu />)
        expect(wrapper).toMatchSnapshot();
    })
    test("Home in index matches snapshot", () => {
        jest.setTimeout(10000);
        const wrapper = shallow (<Home />)
        expect(wrapper).toMatchSnapshot();
    })
    test("Login in loginfile matches snapshot", () => {
        jest.setTimeout(10000);
        const wrapper = shallow(<Login />)
        expect(wrapper).toMatchSnapshot();
    })
    test("Register in loginfile matches snapshot", () => {
        jest.setTimeout(10000);
        const wrapper = shallow(<Register />)
        expect(wrapper).toMatchSnapshot();
    })
    test("LoggedOut in loginfile matches snapshot", () => {
        jest.setTimeout(10000);
        const wrapper = shallow(<LoggedOut />)
        expect(wrapper).toMatchSnapshot();
    })
    test("Register in loginfile matches snapshot", () => {
        jest.setTimeout(10000);
        const wrapper = shallow(<Search match={{params: {searchString: "string"} }}/>)
        expect(wrapper).toMatchSnapshot();
    })
})
