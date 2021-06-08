import React, {useState} from 'react';
import Screen1 from './screen1';
import Constants from '../constants';
import history from '../history';


class Screen3 extends React.Component {
    state = {
        beneficiaries: [],
        states: [],
        vaccine: "No Preference",
        districts: [],
        dose: "",
        fee: "",
        beneficiary: [],
        state_id: "",
        district_id: "",
        token: Constants.token
    }
    

    componentDidMount(){
        const req_headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
            'Origin': 'https://selfregistration.cowin.gov.in/',
            'Referer': 'https://selfregistration.cowin.gov.in/',
            "Authorization": "Bearer "+ this.state.token
        }
        console.log(this.state.token);
        console.log(req_headers)
        fetch("https://cdn-api.co-vin.in/api/v2/appointment/beneficiaries", {
            method: "GET",
            headers: req_headers
        })
        .then(response => {
            if(!response.ok){
                console.log(this.state.token)
            }
            return response.json();
        })
        .then(data => {
            const beneficiaries = data["beneficiaries"];
            this.setState({beneficiaries:beneficiaries})
            console.log(this.state.beneficiaries)
        })

        fetch('https://cdn-api.co-vin.in/api/v2/admin/location/states', {
            method: "GET",
            headers: req_headers
        })
        .then(response => response.json())
        .then(data => {
            const states = data["states"];
            this.setState({states:states});
            console.log(this.state.states);
        })
    }

    handleMemberSelect = (event) => {
        this.state.beneficiary = this.state.beneficiaries[event.target.value];
        //this.setState({ beneficiary: this.state.beneficiaries[event.target.value]});
        console.log(this.state.beneficiary);
    }

    handleFee = (event) => {
        if(event.target.value == 1){
            this.setState({fee: "Free" });
        }else if(event.target.value == 2){
            this.setState({fee: "Paid"});
        }else if(event.target.value == 0){
            this.setState({fee: ""});
        }
    }

    handleStateSelect = (event) => {
        this.state.state_id = event.target.value;

        const req_headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
            'Origin': 'https://selfregistration.cowin.gov.in/',
            'Referer': 'https://selfregistration.cowin.gov.in/',
            "Authorization": "Bearer "+ this.state.token
        }

        fetch("https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+event.target.value, {
            method: "GET",
            headers: req_headers
        })
        .then(response => response.json())
        .then(data => {
            const districts = data["districts"];
            this.setState({districts: districts});
        });
    }

    handleDistrictSelect = (event) => {
        this.state.district_id = event.target.value;
    }

    handleDoseChange = (event) => {
        if(event.target.value != -1){
            this.state.dose = event.target.value;
        }
    }

    handleConfirmClick = (event) => {
        event.preventDefault();

        Constants.beneficiary = this.state.beneficiary;
        Constants.fee = this.state.fee;
        Constants.state_id = this.state.state_id;
        Constants.district_id = this.state.district_id;
        Constants.dose = this.state.dose;
        Constants.vaccine = this.state.vaccine;

        history.push({
            pathname: "/booking",
        });
    }

    handleVaccineSelect = (event) => {
        this.setState({vaccine: event.target.value});
    }


    render() {
        return (

            <div>
            <div class="container-contact100">
                <div class="wrap-contact100">
                    <form class="contact100-form validate-form">
                        <span class="contact100-form-title">
                            Automatic Vaccine Booking
                        </span>
            
                        <div class="wrap-input100 input100-select">
                            <span class="label-input100">Select Member</span>
                            <div>
                                <select class="selection-2" name="member" onChange={this.handleMemberSelect}>
                                    <option value={-1}>Choose A Beneficiary</option>
                                    {
                                        this.state.beneficiaries.map((item, i) => {
                                            return <option value={i}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <span class="focus-input100"></span>
                        </div>

                        <div class="wrap-input100 input100-select">
                            <span class="label-input100">Vaccine Preference</span>
                            <div>
                                <select class="selection-2" name="dose" onChange={this.handleVaccineSelect}>
                                    <option>No Preference</option>
                                    <option>COVISHIELD</option>
                                    <option>COVAXIN</option>
                                    <option>SPUTNIK V</option>
                                </select>
                            </div>
                            <span class="focus-input100"></span>
                        </div>
            
            
                        <div class="wrap-input100 input100-select">
                            <span class="label-input100">Select dose</span>
                            <div>
                                <select class="selection-2" name="dose" onChange={this.handleDoseChange}>
                                    <option value={-1}>Choose your dose</option>
                                    <option value={1}>Dose 1</option>
                                    <option value={2}>Dose 2</option>
                                </select>
                            </div>
                            <span class="focus-input100"></span>
                        </div>
            
                        <div class="wrap-input100 input100-select">
                            <span class="label-input100">Select payment preference</span>
                            <div>
                                <select class="selection-2" name="payment" onChange={this.handleFee}>
                                    <option value={-1}>Choose An Option</option>
                                    <option value={1}>Free</option>
                                    <option value={2}>Paid</option>
                                    <option value={0}>No Preference</option>
                                </select>
                            </div>
                            <span class="focus-input100"></span>
                        </div>
            
            
                        <div id="dist1">
                            <div class="wrap-input100 input100-select">
                                <span class="label-input100">State</span>
                                <div>
                                    <select class="selection-2" name="state" onChange={this.handleStateSelect}>
                                    {
                                        this.state.states.map((item) => {
                                            return <option value={item.state_id}>{item.state_name}</option>
                                        })
                                    }
                                    </select>
                                </div>
                                <span class="focus-input100"></span>
                            </div>
            
                            <div class="wrap-input100 input100-select">
                                <span class="label-input100">District</span>
                                <div>
                                    <select class="selection-2" name="state" onChange={this.handleDistrictSelect}>
                                    {
                                        this.state.districts.map((item) => {
                                            return <option value={item.district_id}>{item.district_name}</option>
                                        })
                                    }
                                    </select>
                                </div>
                                <span class="focus-input100"></span>
                            </div>
                        </div>
            
                    
                        <div class="container-contact100-form-btn">
                            <div class="wrap-contact100-form-btn">
                                <div class="contact100-form-bgbtn"></div>
                                <button class="contact100-form-btn" onClick={this.handleConfirmClick}>
                                    <span>
                                        Confirm
                                        <i class="fa fa-long-arrow-right m-l-7" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

	        </div>

            <div style={{position: "static", left: "0", bottom: "0", width: "100%", backgroundColor: "black", textAlign: "center", paddingTop: "1%", paddingBottom: "1%"}}>
            <p style={{color: "#fff"}}><b>Made with &#10084;&#65039; by Arishmit Ghosh and Sushmit Ghosh</b></p>
            </div>

            </div>

            

        )
    }
}

export default Screen3;