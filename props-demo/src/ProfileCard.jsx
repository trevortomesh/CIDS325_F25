function ProfileCard({name, occupation, image, onHello}){
    return(
        <div style={{border: "1px solid black",
            padding: "10px",
            margin: "10px",
            width: "200px",
            textAlign: "center"
        }}>
            <img
                src={image}
                alt={name}
                style={{width: "100px", borderRadius: "30px", border:"1px solid black"}}
            />
        
            <h2>{name}</h2>
            <p>{occupation}</p>

            <button onClick={() => onHello(name)}>
                Say Hello
            </button>
        </div>
    );
}

export default ProfileCard;