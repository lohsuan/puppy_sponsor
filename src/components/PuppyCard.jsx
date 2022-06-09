import React from 'react'
import { Link } from "react-router-dom";

/**
 * A card component to preview puppy information.
 *
 * @param {Object} props
 * @param {string} props.puppyId - The puppy's id.
 * @param {string} props.name - The puppy's name.
 * @param {string} props.birthday - The puppy's birthday.
 * @param {string} props.imageUrl - The puppy's clear avatar URL.
 * @param {string} props.description - Detail description of the puppy.
 *
 * @returns {JSXElement} PuppyCard, with a donate button.
 * */
export const PuppyCard = ({ puppyId, imageUrl, name, birthday, description }) => {
  return (
    <div
      className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[300px] 2xl:max-w-[350px] sm:min-w-[270px] sm:max-w-[300px]
                         min-w-full flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col justify-between items-center h-full w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <p className="text-white text-base">Name: {name}</p>
          <p className="text-white text-base">Birthday: {birthday}</p>
          <p className="text-white text-base">Description: {description}</p>
        </div>

        <div className="flex flex-col items-center">
          <img src={imageUrl} alt="dog" />
          <Link to={'/puppies/' + puppyId}>
            <div className="bg-[#123338] p-3 px-5 w-max rounded-3xl -translate-y-1/2 shadow-2xl hover:bg-[#16485b]">
              <p className="text-[#37c7da] font-bold">Donate to XXX</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
