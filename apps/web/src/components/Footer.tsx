import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-6 mt-12 border-t border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center flex-col sm:flex-row text-sm">
        <p className="mb-2 sm:mb-0">© 2025 SOLID Shop. Todos los derechos reservados.</p>
        <div className="flex space-x-4">
          <a href="/" className="hover:text-white transition">Nosotros</a>
          <a href="/" className="hover:text-white transition">Términos</a>
          <a href="/" className="hover:text-white transition">Privacidad</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
