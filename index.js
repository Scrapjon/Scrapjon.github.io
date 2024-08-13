window.onload = (event) => {
    setDesc();
    document.getElementById('oliver').innerHTML = 'Loading please wait...'

};
function capitalise(input) {
    
    first = input.charAt(0);
    first = first.toUpperCase();
    const remainingLetters = input.slice(1);
    return first + remainingLetters;


}
async function setDesc() {
    word = await getWord();
    desc = description = document.getElementById('desc');
    desc.innerHTML = word;
    oliver =  document.getElementById('oliver');
    oliver.innerHTML = 'Oliver Moloney:'

    
}

async function getWord(){
    const url = "https://random-word-api.herokuapp.com/word" //Publically avaliable API url dont worry :P

    try {
        const response = await fetch(url); // Await the fetch call
        if (!response.ok) {
            throw new Error('Word response was not ok');
        }
    const data = await response.json();
    data
    console.log('word(s) received:', data);
        return data; 
    } catch (error) {
        console.error("Fetch operation failed due to: ", error);
        return []; // Return an empty array in case of an error

    };

    
    



}