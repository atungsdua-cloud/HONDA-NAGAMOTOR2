import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark text-white p-8">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-honda-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}