import React from "react";
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

const PuppyCard = ({ id, name, imageUrl }) => {
    const handleDonate = () => { }

    return (
        <div className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px]
                         min-w-full flex-col p-3 rounded-md hover:shadow-2xl"
        >
            <div className="flex flex-col items-center w-full mt-3">
                <div className="display-flex justify-start w-full mb-6 p-2">
                    <p className="text-white text-base">Name: {name}</p>
                </div>
                <img
                    src={imageUrl}
                />

                <button
                    type="button"
                    onClick={() => { handleDonate() }}
                    className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl"
                >
                    <p className="text-[#37c7da] font-bold">Donate to {name}</p>
                </button>
            </div>
        </div>
    );
};

const Puppys = () => {
    const { currentAccount } = useContext(TransactionContext)

    return (
        <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
            <div className="flex flex-col md:p-12 py-12 px-4">
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2">
                        All Puppys
                    </h3>
                ) : (
                    <h3 className="text-white text-3xl text-center my-2">
                        Connect your account to see the cute puppies
                    </h3>
                )}

                <div className="flex flex-wrap justify-center items-center mt-10">
                    <PuppyCard
                        id="1"
                        name="Lucky"
                        imageUrl="https://i.imgur.com/Abs2mcS.png" />
                </div>
            </div>
        </div>
    );
};

export default Puppys;