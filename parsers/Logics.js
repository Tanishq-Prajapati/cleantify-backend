const mailer = require("nodemailer");

class FieldParser{
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
}

class MailClient{
    constructor(
        ownerEmail,
        ownerEmailPassword
    ){
        this.ownerEmail = ownerEmail
        this.transporter = mailer.createTransport({
            service:"gmail",
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
            subject: `Automated from WIZIBLE-WEB`,
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
