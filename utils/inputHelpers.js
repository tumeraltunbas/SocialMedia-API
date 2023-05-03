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

export const capitalize = (word) => {

    const lower = word.toLowerCase();
    const capitalize = lower.charAt(0).toUpperCase() + lower.slice(1);

    return capitalize;
}