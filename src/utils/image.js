export async function loadDataUrlFromImage(imageUrl) {
    if (!imageUrl) return
    const res = await fetch(imageUrl)
    if (!res.blob) return
    const blob = await res.blob()
    const imageData = await new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
    })
    return imageData
}

export function downloadImage(image, download) {
    if (!image || !download) return
    const dataUrl = image.toDataURL("image/png").replace("image/png", "image/octet-stream")
    download.setAttribute('href', dataUrl)
}
