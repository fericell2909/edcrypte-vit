const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <p className="text-8xl mb-4">404</p>
      <h1 className="text-3xl font-bold mb-2">
        Esta pagina se fue to the moon... y no volvio
      </h1>
      <p className="text-lg text-gray-500 mb-6">
        Parece que esta ruta hizo un rug pull y desaparecio con tus esperanzas.
      </p>
      <div className="text-6xl mb-6 animate-bounce">
        🪙
      </div>
      <p className="text-sm text-gray-400 italic">
        "Buy the dip" dijeron... pero esta pagina ya no tiene soporte.
      </p>
    </div>
  )
}

export default NotFound