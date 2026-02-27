
interface CourseProps {
  title: string
  description: string
}

const Course = (
    {title, description}: CourseProps
) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default Course