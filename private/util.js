exports.PromiseProcessHandler = function(process) {
    return new Promise((onSuccess, onError) => {
        process.on('close', (status) => {
            if (status == 0) {
                onSuccess()
            } else {
                onError(new Error("failed with status " + status));
            }
        });
    });
}
