import React, { Component } from "react";
import Constants from "../constants";
import sha256 from "js-sha256";
import history from "../history";

class Screen2 extends React.Component{

    state = {
        otp: "",
        txnId: Constants.txn_id
    }


    updateState = (event) => {
        this.setState({ otp: sha256(event.target.value, {asString: true}) })
        console.log( JSON.stringify(this.state) );
    }

    clickHandler = (event) => {
        event.preventDefault();

        fetch("https://cdn-api.co-vin.in/api/v2/auth/validateMobileOtp", {
            method: "POST",
            headers: { 
                "content-type": "application/json",
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
                'Origin': 'https://selfregistration.cowin.gov.in/',
                'Referer': 'https://selfregistration.cowin.gov.in/'
            },
            body: JSON.stringify(this.state)
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            Constants.token = data["token"];
            console.log(Constants.token);

            if( Constants.district_id !== "" ){
                history.push("/booking");
            }else{
                history.push("/vaccinedetails");
            }
        });
    } 

    render(){
        return(
            <div class="container-contact100">
                <div class="wrap-contact100">
                    <form class="contact100-form validate-form">
                        <span class="contact100-form-title">
                            Automate your Covid vaccine search
                        </span>

                        <div class="wrap-input100">
                            <span class="label-input100">OTP</span>
                            <input class="input100" type="text" name="phone" placeholder= "Enter Your OTP" onChange={this.updateState}/>
                            <span class="focus-input100"></span>
                        </div>
                        <div><center><button name = "otpconf" class="button" onClick={this.clickHandler} >Confirm and Proceed</button></center></div>

                    </form>
                </div>
	        </div>
        )
    }
}

export default Screen2;
