export default function UserPage({ params }){
    const users ={
        1: "Alice",
        2: "Bobbert",
        3: "Chuckithan"
    };

    const name = users[params.id] || "Unknown User";
    return(
    <>
    <h1>Admin Page</h1>
    <p>ID: {params.id}</p>
    <p>Name: {name}</p>
    </>
);
}