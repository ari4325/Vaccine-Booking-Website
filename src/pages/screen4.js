import React from 'react';
import Constants from '../constants';
import history from '../history';
import logo from '../logo.svg';
import Captcha from '../captcha';
import  convert  from "convert-svg-react";

var count = 0;
var current_year = 2021;

var date = new Date(Date.now());
date.setDate(date.getDate()+1);

var month = date.getMonth()+1;
if( month < 10 ){
	month = "0"+month;
}
var day = date.getDate();
if( day < 10 ){
	day = "0"+day;
}

var curr_date = day+"-"+month+"-"+current_year;
console.log(curr_date);

class Screen4 extends React.Component{
	state = {
		center: "Please wait while we are fetching details",
		date: "",
		pincode: "",
		slots: "",
		msg: "Loading...",
		center_id: "",
		beneficiary: Constants.beneficiary,
		token: Constants.token,
		district_id: Constants.district_id,
		vaccine: Constants.vaccine,
		session_id: "",
		fee_type: Constants.fee,
		captcha: "",
		dose: Constants.dose
	}


	componentDidMount(){
		
		console.log({
			"Beneficiary": Constants.beneficiary,
			"Fee": Constants.fee,
			"State_ID": Constants.state_id,
			"District_ID": Constants.district_id,
			"Dose": Constants.dose
		});

		this.setState({ district_id:Constants.district_id  })
		this.interval = setInterval(() => this.load(), 10000);
		//this.loadCaptcha();
	}

	loadCaptcha(){
		fetch("https://cdn-api.co-vin.in/api/v2/auth/getRecaptcha", {
			method: "POST",
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
				'Origin': 'https://selfregistration.cowin.gov.in/',
				'Referer': 'https://selfregistration.cowin.gov.in/',
				"Authorization": "Bearer "+ this.state.token
			}
		})
		.then(response => {
			if(response.ok){
				return response.json();
			}
			return null;
		})
		.then(data => {
			var captcha = data["captcha"];
			captcha = convert(captcha);
			this.setState(
			{
				captcha: captcha
			});
			console.log(this.state.captcha);
		})
	}

	load(){
		if(Constants.beneficiary.dose1_date !== "" && Constants.dose === "1"){
			this.state.msg = "You have already taken your first dose. Enter proper details and retry";
			this.setState({msg: "You have already taken your first dose. Enter proper details and retry", center: ""})
			//console.log("You have already taken your first dose. Enter proper details and retry")
			window.clearInterval(this.interval)
		}else{

			var age = current_year - Constants.beneficiary.birth_year;
			console.log(age);

			const req_headers = {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
				'Origin': 'https://selfregistration.cowin.gov.in/',
				'Referer': 'https://selfregistration.cowin.gov.in/',
				"Authorization": "Bearer "+ this.state.token
			}
			
			var base_url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id="+this.state.district_id;
			if(this.state.vaccine !== "No Preference"){
				base_url = base_url+"&vaccine="+this.state.vaccine;
			}

			console.log(base_url);

			fetch(base_url+"&date="+curr_date , {
				method: "GET",
				headers: req_headers
			})
			.then(response => {
				if(response.status == 403 || response.status == 401){
					console.log("Token Expired");
					window.clearInterval(this.interval);
					console.log(Constants.phn_number);
					fetch("https://cdn-api.co-vin.in/api/v2/auth/generateMobileOTP", {
						method: 'post',
						headers: { 
							"content-type": "application/json",
							'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
							'Origin': 'https://selfregistration.cowin.gov.in/',
							'Referer': 'https://selfregistration.cowin.gov.in/'
						},
						body: JSON.stringify({mobile: Constants.phn_number, secret: "U2FsdGVkX1+z/4Nr9nta+2DrVJSv7KS6VoQUSQ1ZXYDx/CJUkWxFYG6P3iM/VW+6jLQ9RDQVzp/RcZ8kbT41xw=="})
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
					return null;
				}
				return response.json();
			})
			.then(data => {
				count++;
				console.log(data);
				var centers = data["centers"];
				var i = 0;
				var j = 0;
				loop1:
				for(i = 0; i<centers.length; i++){
					if(this.state.fee_type === centers[i]["fee_type"] || this.state.fee_type === ""){
						var sessions = centers[i]["sessions"];
						console.log(sessions);
						for(j = 0; j<sessions.length; j++){
							var session = sessions[j];
							console.log(centers[i].name);
							if(session.available_capacity_dose1 > 0 && Constants.dose === "1"){
								if(session.min_age_limit < age){
									console.log(session.available_capacity_dose1);
									this.setState({ 
										center: centers[i].name, 
										center_id: centers[i].center_id, 
										date: session.date,
										pincode: centers[i].pincode,
										slots: session["slots"][0],
										vaccine: centers[i]["vaccine_fees"][0].vaccine,
										msg: "Slot found...Attempting to book",
										session_id: session.session_id
									});
									var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
                					audio.play();
									this.attemptBooking();
									window.clearInterval(this.interval)
									break loop1;
								}else{
									this.state.msg = "Slot found but invalid age group";
								}
							}else if(session.available_capacity_dose2 > 0 && Constants.dose === "2"){
								if(session.min_age_limit < age ){
									console.log(session.available_capacity_dose1);
									this.setState({ 
										center: centers[i].name, 
										center_id: centers[i].center_id, 
										date: session.date,
										pincode: centers[i].pincode,
										slots: session["slots"][0],
										vaccine: centers[i]["vaccine_fees"][0].vaccine,
										msg: "Slot found...",
									});
									var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
                					audio.play();
									this.attemptBooking();
									window.clearInterval(this.interval)
									break loop1;
								}else{
									this.state.msg = "Slot found but invalid age group";
								}
							}
						}
					}
				}
				if(this.state.center === "Please wait while we are fetching details"){
					console.log("Attempting to find slot..."+count);
					//this.state.msg = "Attempting to find slot..."+count
					this.setState({msg: "Attempting to find slot..."+count});
				}else{
					console.log(this.state.center);
				}
			})
			.catch(error => {
				console.log(error);
			})

		}

	
	}

	attemptBooking(){

		const req_headers = {
			"content-type": "application/json",
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
			'Origin': 'https://selfregistration.cowin.gov.in/',
			'Referer': 'https://selfregistration.cowin.gov.in/',
			"Authorization": "Bearer "+ this.state.token
		}

		var bfcs = [];
		bfcs.push(this.state.beneficiary["beneficiary_reference_id"]);
		var body = {
			'beneficiaries': bfcs,
			'dose': this.state.dose,
			'center_id' : this.state.center_id,
			'session_id': this.state.session_id,
			'slot'      : this.state.slots,
		}

		console.log(body)

		fetch("https://cdn-api.co-vin.in/api/v2/appointment/schedule", {
			method: "POST",
			headers: req_headers,
			body: JSON.stringify(
				{
					beneficiaries: bfcs,
					dose: this.state.dose,
					center_id : this.state.center_id,
					session_id: this.state.session_id,
					slot: this.state.slots
				}
			)
		})
		.then(res => {
			if (res.ok) return res.json();
			else if(res.status === 409){
				this.state.msg = "Oops, the session is full. Trying again...";
				this.interval = setInterval(()=>this.load(), 10000);
			}
            throw res;
		})
		.then(data => {
			console.log(data)
			var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
			audio.play();
			this.state.msg = "Your slot has been successfully booked"+data["appointment_confirmation_no"];
			console.log(data["appointment_confirmation_no"]);
		})
		.catch(error => error.text().then(errormsg => Promise.reject("[" + error.status + ":" +
            error.statusText + "] while fetching " + error.url + ", response is [" + errormsg+"]"))
        )
	}

    render(){
        return (
			<div>
            <div class="container-contact100">
		    <div class="wrap-contact100">
			<form class="contact100-form validate-form">
				<span class="contact100-form-title">
					Automatic Vaccine Booking
				</span>
				<span class="label-input100"><b>Vaccination Centre:</b>  {this.state.center}</span> <br></br>
				<span class="label-input100"><b>Date:</b>  {this.state.date}</span><br></br>
					<span class="label-input100"><b>Pincode:</b>  {this.state.pincode}</span><br></br>
					<span class="label-input100"><b>Vaccine:</b>  {this.state.vaccine}</span><br></br>
					<span class="label-input100"><b>Slots:</b>  {this.state.slots}</span><br></br><br></br>
					<span class="label-input100"><b>  {this.state.msg}</b></span><br></br>
                
			</form>
		</div>
	</div>

	<div style={{position: "static", left: "0", bottom: "0", width: "100%", backgroundColor: "black", textAlign: "center", paddingTop: "1%", paddingBottom: "1%", marginTop: "-3.5%"}}>
            <p style={{color: "#fff"}}><b>Made with &#10084;&#65039; by Arishmit Ghosh and Sushmit Ghosh</b></p>
            </div>
	</div>

        )
    }
}

export default Screen4;