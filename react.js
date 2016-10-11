function isClass(type) {
	return (
		Boolean(type.prototype) &&
		Boolean(type.prototype.isReactComponent)
	)
}

// function mountComposite(element) {
// 	var type = element.type
// 	var props = element.props

// 	var renderedElement

// 	if (isClass(type)) {
// 		var publicInstance = new type(props)
// 		publicInstance.props = props
// 		if (publicInstance.componentWillMount) {
// 			publicInstance.componentWillMount()
// 		}
// 		renderedElement = publicInstance.render()
// 	} else {
// 		renderedElement = type(props)
// 	}

// 	return mount(renderedElement)
// }

// function mountHost(element) {
// 	var type = element.type
// 	var props = element.props
// 	var children = props.children || []

// 	if (!Array.isArray(children)) {
// 		children = [children]
// 	}

// 	children = children.filter(Boolean)

// 	var node = document.createElement(type)
// 	Object.keys(props).forEach(propName => {
// 		if (propName !== 'children') {
// 			node.setAttribute(propName, props[propName])
// 		}
// 	})

// 	children.forEach(childElement => {
// 		var childNode = mount(childElement)
// 		node.appendChild(childNode)
// 	})

// 	return node
// }

// function mount(element) {
// 	var type = element.type
// 	if (typeof type === 'function') {
// 		return mountComposite(element)
// 	} else if (typeof type === 'string') {
// 		return mountHost(element)
// 	}
// }

// 利用工厂函数来创建正确的实例
function instantiateComponent(element) {
	var type = element.type
	if (typeof type === 'function') {
		return new CompositeComponent(element)
	} else if (typeof type === 'string') {
		return new DOMComponent(element)
	}
}

class CompositeComponent {
	constructor(element) {
		this.currentElement = element
		this.renderedComponent = null
		this.publicInstance = null
	}

	getPublicInstance() {
		return this.publicInstance
	}

	mount() {
		var element = this.currentElement
		var type = element.type
		var props = element.props

		var publicInstance
		var renderedElement

		if (isClass(type)) {
			publicInstance = new type(props)
			publicInstance.props = props
			if (publicInstance.componentWillMount) {
				publicInstance.componentWillMount()
			}
			renderedElement = publicInstance.render()
		} else if (typeof type === 'function') {
			publicInstance = null
			renderedElement = type(props)
		}

		// 保存publicInstance
		this.publicInstance = publicInstance

		var renderedComponent = instantiateComponent(renderedElement)
		this.renderedComponent = renderedComponent // internal instance

		return renderedComponent.mount()
	}

	unmount() {
		var publicInstance = this.publicInstance
		if (publicInstance) {
			if (publicInstance.componentWillUnmount) {
				publicInstance.componentWillUnmount()
			}
		}

		var renderedComponent = this.renderedComponent
		renderedComponent.unmount()
	}

	receive(nextElement) {
		var prevProps = this.currentElement.props
		var publicInstance = this.publicInstance
		var prevRenderedComponent = this.renderedComponent // internal instance of child
		var prevRenderedElement = prevRenderedComponent.currentElement

		this.currentElement = nextElement

		var type = nextElement.type
		var nextProps = nextElement.props

		var nextRenderedElement

		if (isClass(type)) {
			if (publicInstance.componentWillUpdate) {
				publicInstance.componentWillUpdate(prevProps)
			}
			publicInstance.props = nextProps
			nextRenderedElement = publicInstance.render()
		} else if (typeof type === 'function') {
			nextRenderedElement = type(nextProps)
		}
	}
}

class DOMComponent {
	constructor(element) {
		this.currentElement = element
		this.renderedChildren = []
		this.node = null
	}

	getPublicInstance() {
		return this.node
	}

	mount() {
		var element = this.currentElement
		var type = element.type
		var props = element.props
		var children = props.children || []
		if (!Array.isArray(children)) {
			children = [children]
		}

		var node = document.createElement(type)
		this.node = node

		Object.keys(props).forEach(propName => {
			if (propName !== 'children') {
				node.setAttribute(propName, props[propName])
			}
		})

		var renderedChildren = children.map(instantiateComponent)
		this.renderedChildren = renderedChildren // internal instances

		var childNodes = renderedChildren.map(child => child.mount())
		childNodes.forEach(childNode => node.appendChild(childNode))

		return node
	}

	unmount() {
		var renderedChildren = this.renderedChildren
		renderedChildren.forEach(child => child.unmount())
	}

	receive(nextElement) {

	}
}

/*
结果是，每一个composite或host的内部实例，
都有一个指针指向他的子元素的内部实例

composite internal instances需要保存:
1.the current element
2.the public instance if element type is a class
3.the single rendered internal instance可以是一个DOMComponent或CompositeComponent

host internal instances需要保存:
1.the current element
2.the DOM node
3.所有的child internal instances.Each of them 可以是一个DOMComponent或者CompositeComponent
*/

function mountTree(element, containerNode) {
	// 销毁任何已经存在的tree
	if (containerNode.firstChild) {
		unmountTree(containerNode)
	}

	// 创建top-level internal instance
	var rootComponent = instantiateComponent(element)

	// mount the top-level component into the container
	var node = rootComponent.mount()
	containerNode.appendChild(node)

	// Save a reference to the internal instance
	node._internalInstance = rootComponent

	// 返回他提供的public instance(用户定义类的实例)
	var publicInstance = rootComponent.getPublicInstance()
	return publicInstance
}

function unmountTree(containerNode) {
	var node = containerNode.firstChild
	var rootComponent = node._internalInstance

	rootComponent.unmount()
	containerNode.innerHTML = ''
}

var rootEl = document.getElementById('root')
mountTree(<App />, rootEl)