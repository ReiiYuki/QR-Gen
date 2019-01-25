import 'antd/dist/antd.css'

import { Card, Col, Input, Row } from 'antd'
import React, { Component } from 'react'

import QrCodeWithLogo from 'qr-code-with-logo'

class App extends Component {
	state = {
		imageUrl: '',
		text: '',
	}

	qr = null

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
		if (text) {
			await QrCodeWithLogo.toCanvas({
				canvas: this.qr,
				width: 480,
				content: text,
				logo: {
					src: imageUrl,
				}
			})
			this.qr.fillText(text, 24, 450)
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
							<span>Powered by ReiiYuki on <a href="https://github.com/ReiiYuki/QR-Gen">https://github.com/ReiiYuki/QR-Gen</a></span>
						</Col>
					</Row>
				</Card>
			</div>
    	);
  	}
}

export default App;
