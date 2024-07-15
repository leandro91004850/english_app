export async function requestQuiz() {
    const myHeaders = new Headers();

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch("http://192.168.1.40:8000/generation/quiz", requestOptions);
        const result = await response.json();
        console.log("List Question English: ", result);
        return result;
    }catch (error) {
        console.error(error);
        throw error;
    }
}