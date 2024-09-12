import { Label } from '@radix-ui/react-label'
import { Box, Button, Flex, TextField } from '@radix-ui/themes'
import { useAppDispatch, useAppSelector } from '~/store'

import {
  nameCreated,
  nameDeleted,
  nameInputChanged,
  nameSelected,
  nameUpdated,
  searchChanged,
  selectFilteredNameRecords,
  selectUI,
  surnameInputChanged,
} from 'state/crudSlice'
import ListBox from 'components/ListBox/ListBox'

export default function Crud() {
  const dispatch = useAppDispatch()
  const { nameInput, surnameInput, searchInput, nameSelectedId } =
    useAppSelector(selectUI)
  const filteredNameRecords = useAppSelector(selectFilteredNameRecords)

  return (
    <>
      <Label htmlFor="search">Search:</Label>
      <Box height="8px" />
      <TextField.Root
        id="search"
        value={searchInput}
        onChange={(event) => {
          dispatch(searchChanged(event.currentTarget.value))
        }}
        placeholder="Search"
      />
      <Box height="16px" />

      <Flex
        gap="4"
        direction={{ initial: 'column-reverse', sm: 'row' }}
        align={{ initial: 'stretch', sm: 'center' }}
        className="w-full">
        <Box className="flex-1">
          <ListBox.Root
            label="Name Records:"
            selectionMode="single"
            onSelectionChange={(keys) => {
              dispatch(nameSelected((Array.from(keys)[0] as string) || ''))
            }}
            selectedKeys={[nameSelectedId]}
            items={filteredNameRecords}>
            {(nameRecord) => (
              <ListBox.Item>{`${nameRecord.surname}, ${nameRecord.name}`}</ListBox.Item>
            )}
          </ListBox.Root>
        </Box>

        <Box className="flex-1">
          <Label htmlFor="name">Name:</Label>
          <Box height="8px" />
          <TextField.Root
            id="name"
            value={nameInput}
            onChange={(event) => {
              dispatch(nameInputChanged(event.currentTarget.value))
            }}
            placeholder="Name"
          />

          <Box height="16px" />

          <Label htmlFor="surname">Surname:</Label>
          <Box height="8px" />
          <TextField.Root
            id="surname"
            value={surnameInput}
            onChange={(event) => {
              dispatch(surnameInputChanged(event.currentTarget.value))
            }}
            placeholder="Surname"
          />
        </Box>
      </Flex>

      <Box height="16px" />

      <Flex gap="3">
        <Button
          variant="outline"
          onClick={() => {
            dispatch(
              nameCreated({
                name: nameInput,
                surname: surnameInput,
              }),
            )
          }}
          // Couldn't override styles with className, so had to use style
          style={{ flex: '1 1 0' }}>
          Create
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            dispatch(
              nameUpdated({
                id: nameSelectedId,
                name: nameInput,
                surname: surnameInput,
              }),
            )
          }}
          style={{ flex: '1 1 0' }}
          disabled={nameSelectedId === ''}>
          Update
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            dispatch(nameDeleted(nameSelectedId))
          }}
          style={{ flex: '1 1 0' }}
          disabled={nameSelectedId === ''}>
          Delete
        </Button>
      </Flex>
    </>
  )
}
