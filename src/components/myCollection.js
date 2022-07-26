import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Card from "./card/card";

const myCollection = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);

    const collection = data.walletOfOwner;

    return (
        <div>
            <h1 className="myCollection--title">My Collection</h1>
            <div className="myCollection">
                {collection.map((item) => {
                    return (
                    <>
                        <Card id={item} />
                    </>
                    );
                })}
            </div>
        </div>
    );
}

export default myCollection