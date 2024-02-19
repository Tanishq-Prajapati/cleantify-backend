const express = require("express")
const cors = require("cors")
const axios = require("axios")
const {
    FieldParser,
    MailClient
} = require("./parsers/Logics");

require("dotenv").config()

// Main Emailing Logic Class
const mailer = new MailClient(
    process.env.OWNER_EMAIL,
    process.env.OWNER_PASSWORD,
    process.env.MAIL_SERVICE,
    process.env.APP_NAME
);

// registering CORS options
const corsOptions = {
    origin: "https://cleantify.com",
    optionsSuccessStatus: 200
}

// Main API Body Parser
const Parser = new FieldParser()

// getting the Port from .ENV
const PORT = process.env.PORT

const app = express();

// using middlewares here
app.use(express.json())

// using cors here
app.use(cors(corsOptions))

app.get('/', async(req, res) => {
    res.json({
        'status': true,
        'running': 'success',
        'system_status': 'ok'
    })
})

app.post('/contact', async(req, res) => {
    try{
        let {
            first_name,
            surname,
            company_name,
            email,
            message
        } = req.body;
        let capToken = req.headers.authorization;
        console.log(capToken);

        // creating a object of errors
        let Errors = {
            fname: null,
            sname: null,
            company_name: null,
            email: null,
            message: null
        }

        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${capToken}`
        );

        if (!response.data.success){
            // detected error when success is false
            return res
                .status(200)
                .json({
                    success:false,
                    data: null,
                    error:{
                        captcha_error: "Captcha Verification failed, please try again"
                    }
                })
        }

        console.log("Checking First Name...");
        // getting the all properties and validating each of them
        let func_resp = Parser.first_name_checker(first_name);
        if (!func_resp[0]){
            // dectecting errors in if
            Errors.fname = func_resp[1]
        }

        console.log("Checking Surname...");
        // chekcing surname as well
        let func_resp_second = Parser.second_name_checker(
            surname
        );
        if(!func_resp_second[0]){
            // detecting errors in if
            Errors.sname = func_resp_second[1]
        }

        console.log("Checking Email...");
        // checking email as well
        let email_check = Parser.emailValidator(email)
        if (!email_check){
            // detecting errors in if
            Errors.email = "please enter a valid email"
        }

        console.log("Checking for CompanyName...")
        let company_name_check = Parser.companyNameChecker(company_name);
        if(!company_name_check[0]){
            // detecting errors here
            Errors.company_name = company_name_check[1];
        }

        console.log("Checking Message here...");
        // checking for the message here
        let mess_check = Parser.messageValidator(message);
        if (!mess_check[0]){
            // detecting errors here
            Errors.message = "please enter a valid message here"
        }

        console.log("Checking for Main Errors...");
        // checking if any errors or sending mail
        let hasErrors = false;
        Object.keys(Errors).forEach((key, index) => {
            if (Errors[key]){
                // error dectected terminating request
                hasErrors = true;
            }
        })
        if (hasErrors){
            return res
                .status(200)
                .json({
                    success: false,
                    data: null,
                    error:Errors
                })
        }
        console.log("Sending Mail...");
        let mailResp = await mailer.sendMail(
            "fireeyes635@gmail.com",
            first_name,
            surname,
            email,
            message,
            company_name
        );
        console.log("Mail Sended Successfully...");
        return res
            .json({
                success:true,
                data: null,
                error: null
            })
    }
    catch(e){
        // giving e.message for testing purposes only
        console.log(e);
        return res
            .json({
                success: false,
                data: null,
                error: e.message
            })
    }
})

app.listen(PORT, ()=>{
    console.log(`Listening in Port: ${PORT}`);
})
