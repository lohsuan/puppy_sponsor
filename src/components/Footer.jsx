const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <img src="/logo.webp" alt="logo" className="w-16" />

    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center">
        Come join us for the better place for all cute puppies
      </p>
      <a
        href={`https://github.com/lohsuan/puppy_sponsor`}
        target="_blank"
        rel="noreferrer"
        className="text-white text-sm text-center font-medium mt-2 hover:text-blue-400"
      >
        <p>code@puppy_sponsor</p>
      </a>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <a
        href={`https://github.com/lohsuan/puppy_sponsor`}
        target="_blank"
        rel="noreferrer"
        className="text-white text-left text-xs hover:text-blue-400"
      >
        <p>code@puppy_sponsor</p>
      </a>
      <p className="text-white text-right text-xs">All rights reserved</p>
    </div>
  </div>
)

export default Footer
