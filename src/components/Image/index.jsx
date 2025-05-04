const Image = ({image, caption}) => {
  return (
    <figure>
      <img src={image} />
      {caption ? <figcaption align='center'>{caption}</figcaption> : null}
    </figure>
  );
};

export default Image;
