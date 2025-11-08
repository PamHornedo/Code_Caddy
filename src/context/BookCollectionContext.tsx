import { createContext, useContext, useReducer, ReactNode } from "react";
import { searchBooks as searchGoogleBooks } from "../services/googleBooksApi";

const sampleBooks = [
  {
    id: "1",
    title: "The Great Gatsby",
    authors: ["F. Scott Fitzgerald"],
    description: "A classic American novel",
    publishedDate: "1925",
    pageCount: 180,
    imageLinks: {
      thumbnail: "https://via.placeholder.com/128x192/4a90e2/ffffff?text=Book",
    },
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    authors: ["Harper Lee"],
    description: "A story of racial injustice and childhood innocence",
    publishedDate: "1960",
    pageCount: 281,
    imageLinks: {
      thumbnail: "https://via.placeholder.com/128x192/7ed321/ffffff?text=Book",
    },
  },
];

type BookStatus = "want-to-read" | "currently-reading" | "have-read";

interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  publishedDate?: string;
  pageCount?: number;
  imageLinks?: {
    thumbnail: string;
  };
  status?: BookStatus;
}
interface BookCollectionState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  searchResults: Book[];
  currentlyReading: Book[];
  wantToRead: Book[];
  haveRead: Book[];
}

interface BookCollectionActions {
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  updateBookStatus: (bookId: string, status: BookStatus) => void;
  searchBooks: (query: string) => Promise<void>;
  clearSearch: () => void;
}

interface BookCollectionHelpers {
  getBookById: (id: string) => Book | undefined;
  getBooksByStatus: (status: BookStatus) => Book[];
  getTotalBooks: () => number;
  getReadingProgress: () => { completed: number; total: number };
}

interface BookCollectionContextValue
  extends BookCollectionActions,
    BookCollectionHelpers {
  books: Book[];
  searchResults: Book[];
}

const BookCollectionContext = createContext<
  BookCollectionContextValue | undefined
>(undefined);

type BookCollectionAction =
  | { type: "ADD_BOOK"; payload: Book }
  | { type: "REMOVE_BOOK"; payload: string }
  | { type: "UPDATE_BOOK_STATUS"; payload: { id: string; status: BookStatus } }
  | { type: "SET_SEARCH_RESULTS"; payload: Book[] };

function bookCollectionReducer(
  state: BookCollectionState,
  action: BookCollectionAction
): BookCollectionState {
  switch (action.type) {
    case "ADD_BOOK":
      return {
        ...state,
        books: [...state.books, { ...action.payload, status: "want-to-read" }],
      };
    case "REMOVE_BOOK":
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload),
      };
    case "UPDATE_BOOK_STATUS":
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id
            ? { ...book, status: action.payload.status }
            : book
        ),
      };
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.payload,
      };
    default:
      return state;
  }
}

const initialState: BookCollectionState = {
  books: sampleBooks.map((book) => ({ ...book, status: "want-to-read" })),
  searchResults: [],
  isLoading: false,
  error: null,
  currentlyReading: [],
  wantToRead: [],
  haveRead: [],
};

export function BookCollectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookCollectionReducer, initialState);

  const addBook = (book: Book) => {
    dispatch({ type: "ADD_BOOK", payload: book });
  };

  const removeBook = (bookId: string) => {
    dispatch({ type: "REMOVE_BOOK", payload: bookId });
  };

  const updateBookStatus = (bookId: string, status: BookStatus) => {
    dispatch({ type: "UPDATE_BOOK_STATUS", payload: { id: bookId, status } });
  };

  const searchBooks = async (query: string) => {
    try {
      console.log("Searching for:", query);

      interface GoogleBooksApiResult {
        items: Book[];
      }

      const result: GoogleBooksApiResult = await searchGoogleBooks(query);

      const booksWithStatus: Book[] = result.items.map((book: Book) => ({
        ...book,
        status: "want-to-read",
      }));

      dispatch({ type: "SET_SEARCH_RESULTS", payload: booksWithStatus });
    } catch (error) {
      console.error("Search failed:", error);
      // Fallback to mock results if API fails
      const mockResults: Book[] = [
        {
          id: `search-${Date.now()}`,
          title: `Search Result: ${query}`,
          authors: ["Sample Author"],
          description: "This is a mock search result (API may be unavailable)",
          publishedDate: "2023",
          pageCount: 200,
          imageLinks: {
            thumbnail:
              "https://via.placeholder.com/128x192/ff6b6b/ffffff?text=Search",
          },
          status: "want-to-read",
        },
      ];
      dispatch({ type: "SET_SEARCH_RESULTS", payload: mockResults });
    }
  };

  const value: BookCollectionContextValue = {
    books: state.books,
    searchResults: state.searchResults,

    addBook,
    removeBook,
    updateBookStatus,
    searchBooks,
    clearSearch: () => dispatch({ type: "SET_SEARCH_RESULTS", payload: [] }),

    getBooksByStatus: (status: BookStatus) =>
      state.books.filter((book) => book.status === status),

    getBookById: (id: string) => state.books.find((book) => book.id === id),

    getTotalBooks: () => state.books.length,

    getReadingProgress: () => {
      const completed = state.books.filter(
        (book) => book.status === "have-read"
      ).length;
      return { completed, total: state.books.length };
    },
  };

  return (
    <BookCollectionContext.Provider value={value}>
      {children}
    </BookCollectionContext.Provider>
  );
}

export function useBookCollection() {
  const context = useContext(BookCollectionContext);
  if (context === undefined) {
    throw new Error(
      "useBookCollection must be used within a BookCollectionProvider"
    );
  }
  return context;
}
