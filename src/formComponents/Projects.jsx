import React from 'react'

export const Projects = ({title, description, image}) => {
  return (
    <section className="flex flex-col mb-8 gap-y-16">
  
      <article>
        <h3 className="text-2xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          {title}
        </h3>
        <p className="text-lg mb-4 text-pretty">{description}</p>
        <ul className="flex gap-x-2 flex-row mb-2">
        </ul>
        {
image &&
          <img
          loading="lazy"
          className="rounded shadow-2xl shadow-white/10 "
          src={image}
          alt={`Captura de pantalla del proyecto ${image}`}
          />
        }
      </article>
</section>
  )
}
