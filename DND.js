 class DND {
     _dragableNodes = [];
     _containersNodes = [];
     _activeDragNode = null;
     _dragPoints = { x: null, y: null };
     _events = []

     constructor(dragableNodes, containersNodes) {
         this._dragableNodes = dragableNodes;
         this._containersNodes = containersNodes;
         this._init();
     }

     _init() {
         for (let dragable of this._dragableNodes) {
             dragable.addEventListener("mousedown", this._mouseDownHandler);
             this._events.push({ element: dragable, event: 'mousedown', handler: this._mouseDownHandler })

             document.addEventListener("mouseup", this._mouseUpHandler)
             this._events.push({ element: document, event: 'mouseup', handler: this._mouseUpHandler })

             document.addEventListener("mousemove", this._mouseMoveHandler)
             this._events.push({ element: document, event: 'mousemove', handler: this._mouseMoveHandler })

         }
     }

     _mouseDownHandler = (e) => {
         // 0 = left click
         if (e.button == 0) {
             this._activeDragNode = e.currentTarget;
         }
     }

     _mouseUpHandler = () => {
         if (this._activeDragNode) {
             this._tryTransfer();
             this._cleanUp();
         }
     }

     _tryTransfer() {
         for (let container of this._containersNodes) {
             const parentNode = this._activeDragNode.parentNode

             if (container == parentNode) continue;

             const rect1 = this._activeDragNode.getClientRects()[0];
             const rect2 = container.getClientRects()[0];
             const detected = collision(rect1, rect2);
             if (detected) {
                 parentNode.onElementLeft && parentNode.onElementLeft(this._activeDragNode)
                 parentNode.removeChild(this._activeDragNode);
                 container.appendChild(this._activeDragNode);
                 container.onElemenEntered && container.onElemenEntered(this._activeDragNode)
             }
         }
     }

     _cleanUp() {
         this._dragPoints = { x: null, y: null };
         this._activeDragNode.style.position = "";
         this._activeDragNode.style.left = "";
         this._activeDragNode.style.top = "";
         this._activeDragNode = null;
     }

     _mouseMoveHandler = (e) => {
         if (this._activeDragNode) {
             if (this._dragPoints.x == null) {
                 const nodeRect = this._activeDragNode.getClientRects()[0];
                 this._dragPoints.x = e.clientX - nodeRect.x;
                 this._dragPoints.y = e.clientY - nodeRect.y;
             }
             this._activeDragNode.style.position = "absolute";
             this._activeDragNode.style.left = e.clientX - this._dragPoints.x + "px";
             this._activeDragNode.style.top = e.clientY - this._dragPoints.y + "px";
         }
     }

     cleanEvents() {
         this._events.forEach(e => {
             e.element.removeEventListener(e.event, e.handler)
         })
     }
 }

 function collision(rect1, rect2) {
     if (
         rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y
     )
         return true;
 }