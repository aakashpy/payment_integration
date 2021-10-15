import React, { useState, useRef } from 'react'
import axios from 'axios'
import emailjs from 'emailjs-com'
import './Home.css'
require('dotenv').config();

const Home = () => {
    const form = useRef();
    var orderid={}
    var options={}
    const [values, setValues] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(values => ({ ...values, [name]: value, }));
    }
    function onSubmit(e) {
        e.preventDefault();
        var create_order_id = {
            "amount": values.amount * 100,
            "currency": "INR",
            "receipt": "rcptid_11"
        }

        axios.post('/payment', create_order_id)
            .then((res) => {
                orderid = res.data
                options = {
                    "key": process.env.REACT_APP_KEYID,
                    "amount": values.amount * 100,
                    "currency": "INR",
                    "name": "Donation",
                    "order_id": orderid.id,
                    "description": "Thank you for your donation. A small help can bring a big change",
                    "prefill": {
                        "name": values.name,
                        "contact": values.contact,
                        "email": values.email,
                    },
                    "notes": {
                        "address": "Razorpay Corporate Office"
                    },
                    "handler": function (response) {
                        var email_params={
                            ...values,
                            "payment_id":response.razorpay_payment_id
                        }
                        emailjs.send(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, email_params, process.env.REACT_APP_USER_ID)
                            .then((result) => {
                                console.log(result.text);
                                alert("An Email of your donation will be sent to you soon")
                            }, (error) => {
                                console.log(error.text);
                            });
                    }
                };
            })
            .then((data)=>{
                if (data!=={}){
                    donate();
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const donate = () => {
        console.log(options)
        var rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', function (response) {
            alert(response.error.code);
        });
    }
    return (
        <>
            <div class="container-fluid body">
                <div className="conatiner">
                    <h1 className="text-centre first-text">IF YOU ATE TODAY THANK A FARMER</h1>
                </div>
                <div class="row">
                    <div class="col-sm-9">
                        <img src="https://images.unsplash.com/photo-1600150806193-cf869bcfee05?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1631&q=80" className="img-fluid hero-img" alt="" />
                    </div>
                    <div class="col-sm-3">

                        <div class="card text-center">
                            <div class="card-header">
                                <h2>Fill the donation form</h2>
                            </div>
                            <div class="card-body">
                                <form ref={form} onSubmit={onSubmit}>
                                    <div class="form-group">
                                        <label htmlFor="exampleInputName"><h4>Full Name</h4></label>
                                        <input type="text" class="form-control" id="exampleInputName" placeholder="Enter Full Name" value={'' || values.name} name="name" onChange={handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label htmlFor="exampleInputEmail1"><h4>Email address</h4></label>
                                        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email" value={'' || values.email} name="email" onChange={handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label htmlFor="exampleInputNumber"><h4>Contact Number</h4></label>
                                        <input type="phone" max="10" class="form-control" id="exampleInputNumber" placeholder="Contact Number" value={'' || values.contact} name="contact" onChange={handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label htmlFor="exampleInputAmount"><h4>Donation Amount</h4></label>
                                        <input type="number" min="0" class="form-control" id="exampleInputAmount" placeholder="Donation Amount" value={0 || values.amount} name="amount" onChange={handleChange} />
                                    </div>

                                    <button type="submit" class="btn btn-primary">Submit</button>
                                </form>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <footer className="text-center">
                <h5>COPYRIGHT @ AAKASH GHOLE</h5>
            </footer>
        </>
    )
}

export default Home
