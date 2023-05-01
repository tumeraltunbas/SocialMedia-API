export const validatePassword = (password) => {

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    return regex.test(password);
}

export const validateInputs = (...inputs) => {

    for(let input of inputs){

        if(!input){
            return false;
        }

    }

    return true;
}