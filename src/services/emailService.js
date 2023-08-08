require('dotenv').config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking care 👻" <duchuy246938@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Bookingcare</P>
        <p>Thông tin đặt lịch khám bệnh:</P>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là sự thật, vui lòng click vào đường link bên dưới để
        xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Bấm vào đây</a>
        </div>
        <div>Xin chân thành cảm ơn. </div>
        `
    } else {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on Bookingcare</P>
        <p>Information to schedule an appointment:</P>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If the above information is true, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Sincerely thank. </div>
        `
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online thành công</P>
        <p>Thông tin đơn thuốc/ hóa đơn được gửi trong file đính kèm.</P>
        
        <div>Xin chân thành cảm ơn. </div>
        `
    } else {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on Bookingcare</P>
        <p>Information to schedule an appointment:</p>
        <div>Sincerely thank. </div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking care 👻" <duchuy246938@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: "base64"
            },
        ],
    });
}


module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
}