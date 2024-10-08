import { useEffect, useState } from 'react'
import { useLoaderData, Link, useOutletContext } from 'react-router-dom'
import { getPages } from '../services/pages'
import { NewPageForm } from '../components/NewPage'
import { FavoritesMenu, blackCircle } from '../components/Favorites'
import { Footer } from '../components/Footer'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import parse from 'html-react-parser'

export async function loader({ request }) {
  const pages = await getPages()
  return { pages }
}

const reorderWithinColumn = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const moveBetweenColumns = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)
  destClone.splice(droppableDestination.index, 0, removed)
  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone
  return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  boxShadow: isDragging ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : 'none',
  ...draggableStyle,
})

const getListStyle = (isDraggingOver) => ({
  border: isDraggingOver ? 'none' : 'none',
})

export default function Index() {
  const { pages } = useLoaderData()
  const [currentPage, setCurrentPage] = useOutletContext() // eslint-disable-line no-unused-vars
  useEffect(() => {
    setCurrentPage(undefined)
  })

  const categoryPages = Object.groupBy(pages, (page) => page.category)
  const categories = Object.keys(categoryPages)
    .sort()
    .map((category) => {
      return { id: category.toLowerCase().replace(/ /g, ''), name: category }
    })

  let columns = []
  for (let i = 0; i < 5; i++) {
    columns.push(categories.filter((item, index) => index % 5 === i))
  }

  const [matrix, setMatrix] = useState(columns)

  function onDragEnd(result) {
    const { source, destination } = result
    if (!destination) {
      return
    }
    const sInd = source.droppableId
    const dInd = destination.droppableId
    if (sInd === dInd) {
      const items = reorderWithinColumn(matrix[sInd], source.index, destination.index)
      const newMatrix = [...matrix]
      newMatrix[sInd] = items
      setMatrix(newMatrix)
    } else {
      const result = moveBetweenColumns(matrix[sInd], matrix[dInd], source, destination)
      const newMatrix = [...matrix]
      newMatrix[sInd] = result[sInd]
      newMatrix[dInd] = result[dInd]
      setMatrix(newMatrix.filter((group) => group.length))
    }
  }

  return (
    <div className="grid grid-rows-index min-h-screen">
      <div className="flex justify-between items-center px-8">
        <h1 className="-ml-4 mt-32 text-headline font-bold text-stone-100">Notebook</h1>
        <FavoritesMenu pages={pages} className="font-medium" />
        <NewPageForm pages={pages} />
      </div>
      <div className="flex flex-row justify-between">
        <DragDropContext onDragEnd={onDragEnd}>
          {matrix.map((column, i) => (
            <Droppable key={i} droppableId={`${i}`}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps} key={`col-${i}`} className="p-4 w-1/5">
                  {column.map((category, j) => (
                    <Draggable key={category.id} draggableId={category.id} index={j}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={`col-${i}-${j}`}
                          className="p-4"
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          <h1 className="font-light text-xl mb-1 pl-2 pb-1 border-b block border-gray-400 text-gray-400">
                            {category.name !== 'undefined' ? category.name : 'Uncategorized'}
                          </h1>
                          <ul className="pl-2">
                            {categoryPages[category.name].map((page) => (
                              <li key={page.id}>
                                <Link to={`/pages/${page.id}/`}>
                                  {page.title}
                                  {page.favorite && <span className="ml-2 text-orange-600">{parse(blackCircle)}</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <Footer className="px-8 py-4" />
    </div>
  )
}
