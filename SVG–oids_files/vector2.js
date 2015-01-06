// Vector2.js
// A simple 2D Vector library
// usage: var v2 = new Vector2();

function Vector2 (x1, y1, x2, y2) // Constructor makes a vector from two points. 
{
    this.x = x2 - x1;
    this.y = y2 - y1;
    
    this.length = _v2ComputeLength;
    this.toString = _v2toString;   
    this.normal = _v2Normal;
    this.add = _v2Add;
    this.subtract = _v2Subtract;
    this.rotate = _v2Rotate;
    this.smult = _v2ScalarMultiply;
    this.makeRandomDirection = _v2MakeRandomDirection;
}

function _v2MakeRandomDirection()
{
    this.x = Math.random();
    var foo = 4*4; // try to get a different seed. 
    this.y = Math.random();
    var temp = this.normal();
    var sign = Math.random();    
    if (sign > .5) {
        temp.x = -temp.x;
    }
    if (sign > .5) {
        temp.y = -temp.y;
    }
    var foo = 4*4; // try to get a different seed. 
        
    this.x = temp.x;
    this.y = temp.y;
}

function _v2ScalarMultiply(scalar)
{
    var ret = new Vector2(0,0,this.x,this.y);
    ret.x = ret.x * scalar;
    ret.y = ret.y * scalar;
    
    return ret;
}

function _v2Rotate(cx, cy, rad)
{
    var oldx = this.x;
    var oldy = this.y;
    
    this.x = cx + (Math.cos(rad) * (oldx - cx) - Math.sin(rad) * (cy - oldy));
    this.y = cy + (Math.sin(rad) * (oldx - cx) + Math.cos(rad) * (cy - oldy));    
}

function _v2ComputeLength()
{
    return Math.sqrt(this.x*this.x + this.y*this.y);
}

function _v2toString()
{
    return "(" + this.x + "," + this.y + ")";
}

function _v2Normal()
{
    var len = this.length();
    var ret = new Vector2(0,0,0,0);
    ret.x = this.x / len;
    ret.y = this.y / len;
    return ret;
}

function _v2Add(v2)
{
    var ret = new Vector2(0,0,0,0);
    ret.x = this.x + v2.x;
    ret.y = this.y + v2.y;
    return ret;   
}

function _v2Subtract(v2)
{
    var ret = new Vector2(0,0,0,0);
    ret.x = this.x - v2.x;
    ret.y = this.y - v2.y;
    return ret;   
}
