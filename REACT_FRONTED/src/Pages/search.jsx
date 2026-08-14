import { useState } from "react";
import axios from "axios";

function Search() {

    const [keyword, setKeyword] = useState("");
    const [users, setUsers] = useState([]);

    const searchUser = async () => {
        const res = await axios.get(
            `http://localhost:3000/search?keyword=${keyword}`
        );

        setUsers(res.data);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <button onClick={searchUser}>
                Search
            </button>

            {users.map((user) => (
                <div key={user.id}>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
}

export default Search;