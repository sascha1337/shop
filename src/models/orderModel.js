import orderSchema from '../schemas/orderSchema'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });

const Order = mongoose.model('order', orderSchema)


Order.setPayed = function (payment) {
    console.log('setOrderPayed', payment)
    let data = JSON.parse(payment.data)
    console.log('setOrderPayed - data', data)

    let order = data.order

    console.log('setOrderPayed - order', order)

    Order.findOne({ _id: order._id }, function(err, order) {
        if(!err) {
            if(!order) {
                // there is no order with this id
                console.log('setOrderPayed no order found.')
            } else {
                order.status = 'payed42';
                order.save(function(err) {
                    if(!err) {
                        console.log("order payed ", order._id);
                        console.log('order - item', order)
                        var mailOptions = { from: 'no-reply@einfachIOTA.de', to: order.email, subject: 'Das einfachIOTA Magazin hat Deine Zahlung erhalten.', text: 'Hallo ' + order.first_name + ',\n\n' + 'vielen Dank für den Kauf. Wir wünschen dir viel Spaß beim Lesen,' + '\n' + 'Dein einfachIOTA Team.' };
                        transporter.sendMail(mailOptions, function(err) {
                            if (err) { console.log("Error sending mail.", err) }
                            console.log("Paymend success message sent to: ", order.email)
                        });
                    }
                    else {
                        console.log("Error: could not save order " + order._id);
                    }
                });
            }

        } else {
            console.log('setOrderPayed error: ', err)
        }
    });

}

export default Order

