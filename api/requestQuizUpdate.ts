export function requestQuizUpdate(id: any, portugues: any) {
    const myHeaders = new Headers();

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://javeiro.com.br:5000/generation/quiz/" + id + "/" + portugues, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("List Question English: ", result);
        })
        .catch(error => {
            console.error(error);
        });
}