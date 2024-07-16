export function requestQuizUpdate(id: any, portugues: any) {
    const myHeaders = new Headers();

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://192.168.1.10:8000/generation/quiz/" + id + "/" + portugues, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("List Question English: ", result);
        })
        .catch(error => {
            console.error(error);
        });
}