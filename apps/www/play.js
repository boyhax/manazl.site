let filter = {
    checkin:"2024-11-24"
}
if (filter.checkin) {
        console.log('is date :>> ', new Date(filter.checkin) instanceof Date);
        console.log('filter.checkin :>> ', new Date(filter.checkin).toString());

    }