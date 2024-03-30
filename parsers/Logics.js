const mailer = require("nodemailer");

class FieldParser{
    companyNameChecker(company_name){
        // checking if the company_name is not blank
        let company_name_empty = this.isFieldBlank(company_name);
        if(company_name_empty) return [false, "Company name must have 3 characters"];
        return [true];
    }

    first_name_checker(
        name_here
    ){
        // checking first if name is more than 3 chars
        let namer = String(name_here);
        if (this.is_allnums(name_here)){
            return [false, "First name must contain a alphabet"]
        }

        // now checking the length of first_name here
        if (namer.length < 3){
            return [false, "First name must contain atleast 3 characters"]
        }

        return [true]
    }

    second_name_checker(
        name_here
    ){
        // checking first if name is more than 3 chars
        let namer = String(name_here);
        if (this.is_allnums(name_here)){
            return [false, "Surname name must contain a alphabet"]
        }

        // now checking the length of first_name here
        if (namer.length < 3){
            return [false, "Surname name must contain atleast 3 characters"]
        }

        return [true]
    }

    emailValidator(email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Test the provided email against the regular expression
        return emailRegex.test(email);
    }

    messageValidator(message){
        if (String(message).length < 10 || this.isMessageBlank(message)){
            return [false, "Message must be greater then 10 characters"]
        }
        return [true]
    }

    isFieldBlank(field){
        let messer = String(field);
        while (messer.includes(" ")){
            messer = messer.replace(" ", "")
        }
        return (messer.length <= 0) ? true : false;
    }

    isMessageBlank(message){
        console.log("checking for message blankness");
        let messer = String(message);
        while (messer.includes(" ")){
            messer = messer.replace(" ", "")
        }
        console.log("checking for messageers....");
        return (messer.length <= 0) ? true : false;
    }

    is_allnums(name_here){
        let numbers = "1234567890"
        for(let i = 0; i < name_here.length; i++){
            if(!numbers.includes(name_here[i])){
                return false;
            }
        }
        return true;
    }

    async sleep(timer_seconds){
        // creating a promise returning fucntion when timer ends
        return new Promise(async (res, rej) => {
            // now using the timeout here
            setTimeout(()=>{
                res(true)
            }, parseInt(timer_seconds) * 1000)
        })
    }
}

class MailClient{
    constructor(
        ownerEmail,
        ownerEmailPassword,
        mailService,
        app_name
    ){
        this.appName = app_name;
        this.ownerEmail = ownerEmail
        this.transporter = mailer.createTransport({
            service:mailService,
            auth:{
                user: ownerEmail,
                pass: ownerEmailPassword
            }
        });
    }

    async sendMail(
        toemail,
        fname,
        sname,
        email,
        message,
        companyName
    ){
        await this.transporter.sendMail({
            from:this.ownerEmail,
            to: toemail,
            subject: `Automated from ${this.appName}`,
            text:`
                FirstName -> ${fname}
                SecondName -> ${sname}
                Email -> ${email}
                Message -> ${message}
                CompanyName -> ${companyName}
            `
        }).then((data)=>{
            console.log(data);
        }).catch((err) => {
            console.log(err)
            return [false, err]
        })
        return [true]
    }
}

module.exports = {
    FieldParser,
    MailClient
}
