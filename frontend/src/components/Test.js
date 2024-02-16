import React from 'react'

export default function Test() {
  return (
    <div>
        <form>
        <label for="fname">First name:</label><br/><br/>
            <input type="text" id="fname" name="fname" /><br/><br/>
            <input type="submit" value="Submit" />
        </form>
    </div>
  )
}
