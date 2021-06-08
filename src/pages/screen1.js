import React, {Component} from 'react';
import history from '../history';
import Constants from '../constants';

class Screen1 extends React.Component{
    state = { value: ''};

    update = (event) => {
        this.setState({ value:event.target.value })
        console.log( event.target.value )
    }

    clickHandler = (event) => {
        event.preventDefault();
        const val = this.state.value;
        console.log( "Number: ", val );
        Constants.phn_number = val;

        fetch("https://cdn-api.co-vin.in/api/v2/auth/generateMobileOTP", {
            method: 'post',
            headers: { 
                "content-type": "application/json",
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
                'Origin': 'https://selfregistration.cowin.gov.in/',
                'Referer': 'https://selfregistration.cowin.gov.in/'
            },
            body: JSON.stringify({mobile: val.toString(), secret: "U2FsdGVkX1+z/4Nr9nta+2DrVJSv7KS6VoQUSQ1ZXYDx/CJUkWxFYG6P3iM/VW+6jLQ9RDQVzp/RcZ8kbT41xw=="})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            Constants.txn_id = data["txnId"];
            console.log(Constants.txn_id);

            history.push("/otpverify");
        })
        .catch((error) => {
            console.error(error);
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
                            <span class="label-input100">Phone Number</span>
                            <input class="input100" type="text" name="phone" placeholder="Enter your phone number" onChange={this.update} />
                            <span class="focus-input100"></span>
                        </div>

                        <div>
                            <center>
                                <button name = "btnotp" class="button" onClick={this.clickHandler}>
                                    Send OTP
                                </button>
                            </center>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default Screen1;