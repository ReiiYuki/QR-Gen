import 'antd/dist/antd.css'

import { Card, Col, Input, Row, Button, Checkbox } from 'antd'
import React, { Component } from 'react'
import { getDefaultData, updateQS, updateLocalStorage } from 'utils/data'
import { loadDataUrlFromImage, downloadImage } from 'utils/image'

import QrCodeWithLogo from 'qr-code-with-logo'

class App extends Component {
	state = {
		imageUrl: '',
		text: '',
		title: '',
		textAsTitle: false,
	}

	componentDidMount() {
		this.updateDefaultData()
	}

	componentDidUpdate(prevProps, prevState) {
		this.updateTitleAsText(prevState)
		this.updateData()
		this.updateQr()
	}

	updateDefaultData() {
		const defaultState = getDefaultData(['imageUrl', 'text', 'title'])
		this.setState(defaultState)
	}

	onChange = ({ target: { value, name }}) => {
		this.setState({ [name] : value })
	}

	onChecked = ({ target: { checked, name }}) => {
		this.setState({ [name] : checked })
	}

	updateData() {
		updateQS(this.state)
		updateLocalStorage(this.state)
	}

	updateTitleAsText(prevState) {
		const { textAsTitle, text } = this.state
		const { text: prevText } = prevState
		const shouldUpdate = text !== prevText
		if (shouldUpdate && textAsTitle) {
			this.setState({
				title: text,
			})
		}
	}

	async updateQr() {
		const { imageUrl, text } = this.state
		let imageData = await loadDataUrlFromImage(imageUrl)
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
		}).then(this.updateTitle)
	}

	updateTitle = () => {
		const { title } = this.state
		const context = this.qr.getContext('2d')
		context.font = '14px Kanit'
		context.fillStyle = 'black'
		context.textAlign = 'center'
		context.fillText(title || '', this.qr.width/2, this.qr.height)
	}

  	render() {
		const { imageUrl, text, title } = this.state
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
							<Input
								name="title"
								placeholder="Title (optional)"
								onChange={this.onChange}
								value={title}
								style={{
									marginBottom: 16
								}}
							/>
							<Checkbox
								name="textAsTitle"
								style={{
									marginBottom: 16
								}}
								onChange={this.onChecked}
							>Use Text as Title</Checkbox>
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
									onClick={() => downloadImage(this.qr, this.download)}
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
