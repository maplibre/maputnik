import React from 'react'

export default function SpriteIcon (props) {
  const {metadata, id, data, maxWidth} = props;
  const {image} = metadata;
  const pixelRatio = Math.max(window.devicePixelRatio, 2);

  function getUrls (pixelRatio, url) {
    const out = [];
    for (var i=pixelRatio; i>=1; i--) {
      if (i > 1) {
        out.push(
          url.replace(/.png/, `@${i}x.png`)
        );
      }
      else {
        out.push(url);
      }
    }

    return out.map(url => {
      return `url(${url})`;
    }).join(", ");
  }

  let scale = 1;
  if (data.width > maxWidth) {
    scale = maxWidth/data.width;
  }

  const spriteWidth = image.width * scale;
  const spriteHeight = image.height * scale;
  const width = data.width * scale;
  const height = data.height * scale;
  const x = data.x * scale;
  const y = data.y * scale;

  return <div className="maputnik-sprite-icon">
    <div className="maputnik-sprite-icon__text">
      {id}
    </div>
    {image &&
      <div className="maputnik-sprite-icon__icon">
        <div
          style={{
            width: width,
            height: height,
            backgroundImage: getUrls(pixelRatio, metadata.imageUrl),
            backgroundSize: `${spriteWidth}px ${spriteHeight}px`,
            backgroundPosition: `${-x}px ${-y}px`
          }}
        />
      </div>
    }
  </div>
}

