interface AboutHeaderProps {
  align?: "center" | "start"
  sectionName: string
  title: string
  subtitle: string
  backgroundText?: string
  backgroundColor?: "dark" | "light"
}

const SectionTitle = ({
  sectionName,
  title,
  subtitle,
  align = "start",
  backgroundText,
  backgroundColor = "light",
}: AboutHeaderProps) => {
  const alignmentClass =
    align === "center" ? "text-center items-center" : "text-start items-start"

  return (
    <div className=" relative w-max">
      {backgroundText && (
        <h2
          className={`
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
        font-extrabold text-transparent bg-clip-text bg-gradient-to-b 
        from-gray-100 to-gray-900 opacity-20 pointer-events-none 
        select-none z-0 text-[clamp(3rem,10vw,5rem)] leading-none
      `}
        >
          {backgroundText}
        </h2>
      )}
      <div className={`flex flex-col ${alignmentClass} relative`}>
        <p className="text-yellow-600 font-medium">{sectionName}</p>
        <h2
          className={`text-4xl font-extrabold leading-tight text-gray-900 ${
            backgroundColor === "dark" ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {title}
          <br />
          <span className="text-red-500">{subtitle}</span>
        </h2>
        <div className="h-1 w-10 bg-blue-500 mx-2 my-1 rounded-full"></div>
      </div>
    </div>
  )
}

export default SectionTitle
