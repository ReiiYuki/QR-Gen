import 'antd/dist/antd.css'

import { Card, Col, Input, Row, Button } from 'antd'
import React, { Component } from 'react'

import QrCodeWithLogo from 'qr-code-with-logo'

class App extends Component {
	state = {
		imageUrl: '',
		text: '',
	}

	componentDidMount() {
		this.updateDataByParams()
	}

	componentDidUpdate() {
		this.updateQr()
	}

	updateDataByParams() {
		const urlParams = new URLSearchParams(window.location.search);
		const imageUrl = urlParams.get('imageUrl') || localStorage.getItem('imageUrl') || '';
		const text = urlParams.get('text') || localStorage.getItem('text') || '';
		this.setState({ imageUrl, text })
	}

	onChange = ({ target: { value, name }}) => {
		this.setState({ [name] : value })
	}

	async updateQr() {
		const { imageUrl, text } = this.state
		localStorage.setItem('imageUrl', imageUrl)
		localStorage.setItem('text', text)
		window.history.pushState(null, '', `?text=${text}&imageUrl=${imageUrl}`)
		let imageData
		if (imageUrl) {
			const res = await fetch(imageUrl)
			if (res.blob) {
				const blob = await res.blob()
				imageData = await new Promise(resolve => {
					const reader = new FileReader()
					reader.onload = () => resolve(reader.result)
					reader.readAsDataURL(blob)
				})
			}
		}
		const logo = imageData ? {
			src: imageData,
		} : {
			logoSize: 0,
			borderSize: 0,
		}
		text && QrCodeWithLogo.toCanvas({
			canvas: this.qr,
			width: 480,
			content: text,
			download: true,
			downloadName: `${text}.png`,
			logo: logo,
		})
	}

	save = () => {
		if (this.qr && this.download) {
			const image = this.qr
							.toDataURL("image/png")
							.replace("image/png", "image/octet-stream")
			this.download.setAttribute('href', image)
		}
	}

  	render() {
		const { imageUrl, text } = this.state
    	return (
			<div style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center', 
					height: '100vh',
					width: '100vw',
					background: 'gray',
				}}
			>
				<Card style={{
					width: '100%',
					maxWidth: 900,
					}}
				>
					<Row>
						<Col span={24} style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
							<canvas
								ref={e => this.qr = e}
								crossOrigin="Anonymous"
								style={{
									width: 480,
									height: 480,
									background: 'gray',
								}}
							/>
						</Col>
						<Col span={24}
							style={{
								padding: 16,
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<Input
								name="text"
								placeholder="Text / Url"
								style={{
									marginBottom: 16
								}}
								onChange={this.onChange}
								value={text}
							/>
							<Input
								name="imageUrl"
								placeholder="Logo Url"
								onChange={this.onChange}
								value={imageUrl}
								style={{
									marginBottom: 16
								}}
							/>
							<a
								ref={e => this.download = e}
								download={`${text}.png`}	
							>	
								<Button	
									type="primary"	
									icon="download"	
									size="large"	
									style={{	
										width: '100%',	
									}}
									onClick={this.save}
								>	
									Download	
								</Button>	
							</a>
							<span>Powered by ReiiYuki on <a href="https://github.com/ReiiYuki/QR-Gen">https://github.com/ReiiYuki/QR-Gen</a></span>
						</Col>
					</Row>
				</Card>
			</div>
    	);
  	}
}

export default App;
