import books from "@/app/data/book.json";
import BookCard from "./BookCard";

export default function BookList() {
  return (
    <div className="flex flex-wrap justify-between">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
