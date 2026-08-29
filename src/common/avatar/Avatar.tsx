
const Avatar = ({ name }: { name: string })  => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

    const getBgColor = (name: string) => {
        const colors = ['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-amber-400'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-sm font-bold ${getBgColor(name)}`}>
            {initials}
        </div>
    )
}

export default Avatar;
