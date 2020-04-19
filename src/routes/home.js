import { Component, createRef } from 'preact'

export default class Home extends Component {
  ref = createRef()

  handleImage = e => {
    const reader = new FileReader()
    const ctx = this.ref.current.getContext('2d')
    reader.onload = event => {
        const img = new Image()
        img.onload = () => {
          const sizingFactor = img.height / img.width
          this.ref.current.width = 400
          this.ref.current.height = 400 * sizingFactor
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 400, 400 * sizingFactor)
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(e.target.files[0])
  }

  handleClick = e => {
    const x = e.layerX
    const y = e.layerY
    const ctx = this.ref.current.getContext('2d')

    // get value at pixel
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    this.setState({ color: { r, g, b }})
    console.log('rgb: ', r, g, b)
    const lab = this.rgb2lab({ r, g, b })
    console.log('lab: ', lab)
  }

  rgb2lab = ({ r, g, b }) => {
    r /= 255
    g /= 255
    b /= 255
    let x, y, z
  
    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92
  
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
  
    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116
  
    return {
      l: (116 * y) - 16,
      a: 500 * (x - y),
      b: 200 * (y - z)
    }
  }

  render (_, { color }) {
    let lab
    if (color) lab = this.rgb2lab(color)
    return (
      <div class="container px-1">
        <div className="max-w-3xl">
          <p class="mb-8">
            Select an image to start.
          </p>
          <input
            className="my-4"
            type="file"
            onChange={this.handleImage}
          />
          <canvas
            ref={this.ref}
            onClick={this.handleClick}
          />
          {color && (
            <div>
              <p style={{ color: `rgb(${color.r},${color.g},${color.b})` }}>
                This is the currently active color.
              </p>
              <p>
                RGB values: {color.r}, {color.g}, {color.b}
              </p>
              <p>
                Lab values: {lab.l}, {lab.a}, {lab.b}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
