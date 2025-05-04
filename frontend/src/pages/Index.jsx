import { useEffect } from 'react'
import { useLoaderData, Link, useOutletContext } from 'react-router-dom'
import { getPages } from '../services/pages'
import { NewPageForm } from '../components/NewPage'
import { FavoritesMenu, blackCircle } from '../components/Favorites'
import { Footer } from '../components/Footer'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import parse from 'html-react-parser'
import useLocalStorageState from 'use-local-storage-state'

export async function loader({ request }) {
  const pages = await getPages()
  const sanitizedPages = pages.map((page) => {
    if (page.cid === undefined) {
      page.category = 'Uncategorised'
      page.cid = 'uncategorised'
    }
    return page
  })
  return { pages: sanitizedPages }
}

const groupPagesByCategory = (pages) => Object.groupBy(pages, ({ cid }) => cid)

const extractCategoriesFromPages = (pages) => {
  return Array.from(new Set(pages.map((page) => page.cid)))
    .map((cid) => pages.find((page) => page.cid === cid))
    .map((page) => ({ id: page.cid, name: page.category }))
}

const createColumnsMatrix = (categoryPages, categories) => {
  const columnsMatrix = []
  const sortedCategories = categories.sort((p, q) => p.name.localeCompare(q.name))
  for (let i = 0; i < 5; i++) {
    columnsMatrix.push(sortedCategories.filter((item, index) => index % 5 === i))
  }
  return columnsMatrix
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

const categoriesDiff = (categories1, categories2) => {
  const ids = (categories1) => categories1.map((category) => category.id)
  const categoryIdsToAdd = ids(categories1).filter((category) => !ids(categories2).includes(category))
  return categoryIdsToAdd.map((id) => categories1.find((category) => category.id === id))
}

const categoriesToAdd = (categories, matrix) => categoriesDiff(categories, matrix.flat())

const categoriesToRemove = (categories, matrix) => categoriesDiff(matrix.flat(), categories)

const where = (matrix, category) => {
  const rowIndex = matrix.findIndex((row) => row.some((col) => col.id === category.id))
  const colIndex = matrix[rowIndex].findIndex((col) => col.id === category.id)
  return [rowIndex, colIndex]
}

const itemStyle = (snapshot, provided) => ({
  ...provided.draggableProps.style,
  userSelect: 'none',
  background: snapshot.isDragging ? 'rgb(255, 255, 255)' : 'transparent',
  boxShadow: snapshot.isDragging ? '0 25px 50px -12px rgb(0 0 0 / 0.25)' : 'none',
})

export default function Index() {
  const { pages } = useLoaderData()

  const [currentPage, setCurrentPage] = useOutletContext() // eslint-disable-line no-unused-vars
  useEffect(() => {
    setCurrentPage(undefined)
  })

  const categoryPages = groupPagesByCategory(pages)
  const categories = extractCategoriesFromPages(pages)
  const columnsMatrix = createColumnsMatrix(categoryPages, categories)
  const [matrix, setMatrix] = useLocalStorageState('notebook-categories', { defaultValue: columnsMatrix })

  categoriesToAdd(categories, matrix).forEach((category) => [...matrix][0].splice(0, 0, category))
  categoriesToRemove(categories, matrix).forEach((category) => {
    const pos = where(matrix, category)
    return [...matrix][pos[0]].splice(pos[1], 1)
  })

  useEffect(() => {
    setMatrix(matrix)
  }, [matrix, setMatrix])

  function onDragEnd(result) {
    const { source, destination } = result
    if (!destination) {
      return
    }
    const s = source.droppableId
    const d = destination.droppableId
    if (s === d) {
      const items = reorderWithinColumn(matrix[s], source.index, destination.index)
      const newMatrix = [...matrix]
      newMatrix[s] = items
      setMatrix(newMatrix)
    } else {
      const result = moveBetweenColumns(matrix[s], matrix[d], source, destination)
      const newMatrix = [...matrix]
      newMatrix[s] = result[s]
      newMatrix[d] = result[d]
      setMatrix(newMatrix)
    }
  }

  return (
    <div className="grid grid-rows-index min-h-screen">
      <IndexHeader pages={pages} />
      <div className="flex flex-row justify-between">
        <DragDropContext onDragEnd={onDragEnd}>
          {matrix.map((column, i) => (
            <Droppable key={i} droppableId={`${i}`}>
              {(p, s) => (
                <div ref={p.innerRef} {...p.droppableProps} className="p-4 w-1/5">
                  {column.map((category, j) => (
                    <Draggable key={category.id} draggableId={category.id} index={j}>
                      {(p, s) => (
                        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="p-4 !cursor-default" style={itemStyle(s, p)}>
                          <CategoryCard categoryPages={categoryPages} category={category} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {p.placeholder}
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

function IndexHeader({ pages }) {
  return (
    <div className="flex justify-between items-center px-8">
      <h1 className="-ml-4 mt-32 text-headline font-bold text-stone-100">Notebook</h1>
      <FavoritesMenu pages={pages} className="font-medium" />
      <NewPageForm pages={pages} />
    </div>
  )
}

function CategoryCard({ categoryPages, category }) {
  return (
    <>
      <h1 className="font-light text-xl mb-1 pl-2 pb-1 border-b block border-gray-400 text-gray-400 cursor-grab">{category.name}</h1>
      <ul className="p-2">
        {categoryPages[category.id].map((page) => (
          <li key={page.id} className="flex">
            <Link to={`/pages/${page.id}/`} className="truncate">
              {page.title}
            </Link>
            {page.favorite && <span className="ml-2 text-[#bc0a6f]">{parse(blackCircle)}</span>}
          </li>
        ))}
      </ul>
    </>
  )
}
