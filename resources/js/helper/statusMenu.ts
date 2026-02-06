export const statusDropdownMenu = (role:string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return [
        { value: '', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'publish', label: 'Publish' },
       // { value: 'unpublish', label: 'Unpublish' },
        //{ value: 'archive', label: 'Archive' },
        //{ value: 'return', label: 'Return' },
        //{ value: 'submit', label: 'Submit for Publishing' }
      ]
    case 'publisher':
      return [
        { value: '', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'publish', label: 'Publish' },
        // { value: 'unpublish', label: 'Unpublish' },
        //{ value: 'return', label: 'Return' },
        //{ value: 'submit', label: 'Submit for Publishing' }
      ]
    case 'encoder':
      return [
        { value: '', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        // { value: 'submit', label: 'Submit for Publishing' }
      ]
  }

}
